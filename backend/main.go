package main

import (
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"
	"os"
	"strings"
	"time"

	"github.com/joho/godotenv"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	_ "modernc.org/sqlite"
)

type ContactMessage struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Message  string `json:"message"`
	Captcha  string `json:"g-recaptcha-response"`
	IP       string `json:"ip"`
	Date     time.Time `json:"date"`
}

type Response struct {
	Status       string `json:"status"`
	Message      string `json:"message,omitempty"`
	ErrorMessage string `json:"error_message,omitempty"`
}

type RecaptchaResponse struct {
	Success bool `json:"success"`
}

type EmailConfig struct {
	Provider        string
	BrevoAPIKey     string
	FromEmail       string
	ToEmail         string
	MailpitSMTPHost string
	MailpitSMTPPort string
}

type BlogConfig struct {
	APIURL           string
	APIToken         string
	CFAccessClientID string
	CFAccessSecret   string
}

type BlogPost struct {
	Date       string   `json:"date"`
	Title      string   `json:"title"`
	Categories []string `json:"categories"`
	ReadTime   string   `json:"read_time"`
	Link       string   `json:"link"`
}

var (
	db          *sql.DB
	logger      *zap.Logger
	emailConfig EmailConfig
	blogConfig  BlogConfig
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		// Don't fail if .env file doesn't exist in production
		fmt.Println("Warning: .env file not found, using system environment variables")
	}

	// Initialize logger
	var err error
	logger = initLogger()
	defer logger.Sync()

	// Initialize email configuration
	emailConfig = EmailConfig{
		Provider:        getEnvWithDefault("MAIL_PROVIDER", "mailpit"),
		BrevoAPIKey:     os.Getenv("BREVO_API_KEY"),
		FromEmail:       getEnvWithDefault("FROM_EMAIL", "anshuman@biswas.me"),
		ToEmail:         getEnvWithDefault("TO_EMAIL", "anshuman@biswas.me"),
		MailpitSMTPHost: getEnvWithDefault("MAILPIT_SMTP_HOST", "localhost"),
		MailpitSMTPPort: getEnvWithDefault("MAILPIT_SMTP_PORT", "1025"),
	}

	// Initialize blog configuration
	blogConfig = BlogConfig{
		APIURL:           getEnvWithDefault("BLOG_API_URL", "http://localhost:22222"),
		APIToken:         os.Getenv("BLOG_API_TOKEN"),
		CFAccessClientID: os.Getenv("CF_ACCESS_CLIENT_ID"),
		CFAccessSecret:   os.Getenv("CF_ACCESS_CLIENT_SECRET"),
	}

	logger.Info("Email configuration loaded", 
		zap.String("provider", emailConfig.Provider),
		zap.String("from_email", emailConfig.FromEmail),
		zap.String("to_email", emailConfig.ToEmail),
	)

	// Initialize database
	db, err = sql.Open("sqlite", "./messages.db")
	if err != nil {
		logger.Fatal("Failed to open database", zap.Error(err))
	}
	defer db.Close()

	// Run migrations
	if err := runMigrations(); err != nil {
		logger.Fatal("Failed to run migrations", zap.Error(err))
	}

    // Setup routes
    http.HandleFunc("/api/messages", handleContactForm)
    http.HandleFunc("/api/health", handleHealth)
    // Accept both `/api/posts` and `/api/posts/`
    http.HandleFunc("/api/posts", handleBlogPosts)
    http.HandleFunc("/api/posts/", handleBlogPosts)

	// Enable CORS for all routes
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(w)
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		http.NotFound(w, r)
	})

	port := os.Getenv("BACKEND_PORT")
	if port == "" {
		port = "8080"
	}

	logger.Info("Starting server",
		zap.String("port", port),
		zap.String("mailpit_web", "http://localhost:8025"),
		zap.String("frontend", "http://localhost:3000"),
	)

	if err := http.ListenAndServe(":"+port, nil); err != nil {
		logger.Fatal("Failed to start server", zap.Error(err))
	}
}

func initLogger() *zap.Logger {
	config := zap.NewDevelopmentConfig()
	config.EncoderConfig.TimeKey = "timestamp"
	config.EncoderConfig.EncodeTime = zapcore.ISO8601TimeEncoder
	config.EncoderConfig.StacktraceKey = "" // disable stacktraces for cleaner logs
	
	logger, _ := config.Build()
	return logger
}

func enableCORS(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*") // Allow all origins for development
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}

func handleHealth(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")
	
	logger.Info("Health check requested", zap.String("ip", getClientIP(r)))
	json.NewEncoder(w).Encode(Response{Status: "success", Message: "Backend is healthy"})
}

func handleContactForm(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "POST" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "Only POST method allowed"})
		return
	}

	var message ContactMessage
	
	// Parse JSON body
	if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
		logger.Warn("Invalid JSON received", zap.Error(err), zap.String("ip", getClientIP(r)))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "Invalid JSON format"})
		return
	}

	// Set additional fields
	message.IP = getClientIP(r)
	message.Date = time.Now()

	// Validate required fields
	if message.Name == "" || message.Email == "" || message.Message == "" {
		logger.Warn("Missing required fields", 
			zap.String("ip", message.IP),
			zap.Bool("has_name", message.Name != ""),
			zap.Bool("has_email", message.Email != ""),
			zap.Bool("has_message", message.Message != ""),
		)
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "All fields are required"})
		return
	}

	// Verify reCAPTCHA
	if !verifyRecaptcha(message.Captcha) {
		logger.Warn("reCAPTCHA verification failed", zap.String("ip", message.IP))
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "reCAPTCHA verification failed"})
		return
	}

	// Save to database
	if err := saveMessage(message); err != nil {
		logger.Error("Failed to save message", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "Failed to save message"})
		return
	}

	// Send notification email to me
	if err := sendNotificationEmail(message); err != nil {
		logger.Warn("Failed to send notification email", zap.Error(err))
		// Don't fail the request if email fails
	}

	// Send auto-reply email to sender
	if err := sendAutoReplyEmail(message); err != nil {
		logger.Warn("Failed to send auto-reply email", zap.Error(err))
		// Don't fail the request if email fails
	}

	logger.Info("Message processed successfully",
		zap.String("name", message.Name),
		zap.String("email", message.Email),
		zap.String("ip", message.IP),
	)

	// Return success
	json.NewEncoder(w).Encode(Response{Status: "success", Message: "Message sent successfully"})
}

func verifyRecaptcha(captcha string) bool {
	// For development, accept the test key response
	if captcha == "" {
		return false
	}

	// Google's test key always passes
	if captcha != "" {
		return true
	}

	// In production, you would verify against Google's API:
	/*
	secretKey := os.Getenv("RECAPTCHA_SECRET_KEY")
	if secretKey == "" {
		return false
	}

	resp, err := http.PostForm("https://www.google.com/recaptcha/api/siteverify", url.Values{
		"secret":   {secretKey},
		"response": {captcha},
	})
	if err != nil {
		return false
	}
	defer resp.Body.Close()

	var recaptchaResp RecaptchaResponse
	if err := json.NewDecoder(resp.Body).Decode(&recaptchaResp); err != nil {
		return false
	}

	return recaptchaResp.Success
	*/

	return true
}

func saveMessage(msg ContactMessage) error {
	query := `INSERT INTO email (name, email, message, date, ip) VALUES (?, ?, ?, ?, ?)`
	_, err := db.Exec(query, msg.Name, msg.Email, msg.Message, msg.Date, msg.IP)
	return err
}

func sendNotificationEmail(msg ContactMessage) error {
	subject := fmt.Sprintf("Portfolio Contact: %s", msg.Name)
	
	body := fmt.Sprintf(`From: %s
Subject: %s
To: %s
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e1e5e9;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .message-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
            border-left: 4px solid #667eea;
        }
        .info-row {
            display: flex;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .info-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .label {
            font-weight: 600;
            color: #555;
            width: 80px;
            flex-shrink: 0;
        }
        .value {
            color: #333;
        }
        .message-content {
            background: white;
            padding: 20px;
            border-radius: 6px;
            border: 1px solid #e1e5e9;
            margin-top: 20px;
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 14px;
        }
        .reply-button {
            display: inline-block;
            background: #667eea;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin-top: 20px;
            font-weight: 500;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>New Portfolio Contact</h1>
        <p>Someone reached out through your website</p>
    </div>
    
    <div class="content">
        <div class="message-info">
            <div class="info-row">
                <span class="label">Name:</span>
                <span class="value">%s</span>
            </div>
            <div class="info-row">
                <span class="label">Email:</span>
                <span class="value"><a href="mailto:%s">%s</a></span>
            </div>
            <div class="info-row">
                <span class="label">Date:</span>
                <span class="value">%s</span>
            </div>
            <div class="info-row">
                <span class="label">IP:</span>
                <span class="value">%s</span>
            </div>
        </div>
        
        <h3>Message:</h3>
        <div class="message-content">%s</div>
        
        <div style="text-align: center;">
            <a href="mailto:%s?subject=Re: Your Portfolio Inquiry" class="reply-button">Reply to %s</a>
        </div>
    </div>
    
    <div class="footer">
        <p>This message was sent from your portfolio website at biswas.me</p>
        <p>Received on %s</p>
    </div>
</body>
</html>
`, emailConfig.FromEmail, subject, emailConfig.ToEmail, msg.Name, msg.Email, msg.Email, msg.Date.Format("January 2, 2006 at 3:04 PM MST"), msg.IP, msg.Message, msg.Email, msg.Name, msg.Date.Format("January 2, 2006 at 3:04 PM MST"))

	// Send email via configured provider
	var err error
	if emailConfig.Provider == "mailpit" {
		err = sendEmailViaMailpit(emailConfig.ToEmail, subject, body)
	} else {
		// For Brevo, extract HTML content from body
		htmlContent := extractHTMLFromEmailBody(body)
		err = sendEmailViaBrevo(emailConfig.ToEmail, subject, htmlContent)
	}

	if err != nil {
		return fmt.Errorf("failed to send notification email: %v", err)
	}

	logger.Info("Notification email sent successfully", zap.String("to", emailConfig.ToEmail), zap.String("provider", emailConfig.Provider))
	return nil
}

func getClientIP(r *http.Request) string {
	// Check X-Forwarded-For header first
	forwarded := r.Header.Get("X-Forwarded-For")
	if forwarded != "" {
		ip := strings.TrimSpace(strings.Split(forwarded, ",")[0])
		if ip != "" {
			return ip
		}
	}

	// Check X-Real-IP header
	realIP := r.Header.Get("X-Real-IP")
	if realIP != "" {
		return strings.TrimSpace(realIP)
	}

	// Fall back to RemoteAddr
	remoteAddr := r.RemoteAddr
	if remoteAddr == "" {
		return "Unknown"
	}
	
	// Handle IPv6 addresses in brackets like [::1]:port
	if strings.HasPrefix(remoteAddr, "[") {
		end := strings.Index(remoteAddr, "]")
		if end > 0 {
			return remoteAddr[1:end]
		}
	}
	
	// Handle regular IPv4 addresses like 127.0.0.1:port
	ip := strings.Split(remoteAddr, ":")[0]
	if ip == "" {
		return "localhost"
	}
	return ip
}

func runMigrations() error {
	// Create email table based on the migration file
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS email (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name VARCHAR(100) NOT NULL,
		email VARCHAR(100) NOT NULL,
		message TEXT,
		date DATETIME,
		ip VARCHAR(20) NOT NULL
	);`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create email table: %v", err)
	}

	logger.Info("Database migrations completed successfully")
	return nil
}

func sendAutoReplyEmail(msg ContactMessage) error {
	subject := "Thank you for reaching out - Anshuman Biswas"
	
	body := fmt.Sprintf(`From: %s
Subject: %s
To: %s
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank you for your message</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%);
            color: white;
            padding: 30px 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            background: #ffffff;
            padding: 30px;
            border: 1px solid #e1e5e9;
            border-radius: 0 0 8px 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .greeting {
            font-size: 18px;
            font-weight: 500;
            margin-bottom: 20px;
            color: #333;
        }
        .message {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 6px;
            border-left: 4px solid #667eea;
            margin: 20px 0;
        }
        .signature {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }
        .signature-name {
            font-weight: 600;
            color: #333;
            font-size: 16px;
        }
        .signature-title {
            color: #666;
            font-size: 14px;
            margin: 5px 0;
        }
        .signature-links {
            margin-top: 15px;
        }
        .signature-links a {
            color: #667eea;
            text-decoration: none;
            margin-right: 15px;
            font-size: 14px;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            color: #666;
            font-size: 12px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Thank You for Reaching Out</h1>
        <p>Your message has been received</p>
    </div>
    
    <div class="content">
        <div class="greeting">Hello %s,</div>
        
        <p>Thank you for taking the time to reach out through my portfolio website. I appreciate your interest and the opportunity to connect.</p>
        
        <div class="message">
            <p><strong>Your message has been successfully received and logged.</strong> I typically respond to new inquiries within 24-48 hours during business days.</p>
            
            <p>In the meantime, feel free to:</p>
            <ul>
                <li>Check out my recent projects and experience on my <a href="https://biswas.me" style="color: #667eea;">portfolio</a></li>
                <li>Connect with me on <a href="https://linkedin.com/in/anshumanbiswas" style="color: #667eea;">LinkedIn</a></li>
                <li>View my code repositories on <a href="https://github.com/anchoo2kewl" style="color: #667eea;">GitHub</a></li>
            </ul>
        </div>
        
        <p>I look forward to continuing our conversation and learning more about your project or opportunity.</p>
        
        <div class="signature">
            <div class="signature-name" style="display: flex; align-items: center; gap: 8px;">
                <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="flex-shrink: 0;">
                    <circle cx="16" cy="16" r="16" fill="url(#gradient)" />
                    <g fill="#ffffff">
                        <path d="M16 9 L21 23 L19.25 23 L18.25 20 L13.75 20 L12.75 23 L11 23 L16 9 Z" />
                        <rect x="14.25" y="17" width="3.5" height="1.5" />
                        <path d="M16 12 L17.25 16 L14.75 16 L16 12 Z" fill="url(#gradient)" />
                    </g>
                    <g opacity="0.6" fill="#ffffff">
                        <rect x="5" y="5" width="1" height="1" />
                        <rect x="26" y="5" width="1" height="1" />
                        <rect x="5" y="26" width="1" height="1" />
                        <rect x="26" y="26" width="1" height="1" />
                    </g>
                    <defs>
                        <linearGradient id="gradient" x1="0%%" y1="0%%" x2="100%%" y2="100%%">
                            <stop offset="0%%" style="stop-color:#667eea;stop-opacity:1" />
                            <stop offset="50%%" style="stop-color:#764ba2;stop-opacity:1" />
                            <stop offset="100%%" style="stop-color:#4338ca;stop-opacity:1" />
                        </linearGradient>
                    </defs>
                </svg>
                <span>nshuman Biswas</span>
            </div>
            <div class="signature-links">
                <a href="https://biswas.me">Portfolio</a>
                <a href="https://linkedin.com/in/anshumanbiswas">LinkedIn</a>
                <a href="https://github.com/anchoo2kewl">GitHub</a>
            </div>
        </div>
    </div>
    
    <div class="footer">
        <p>This is an automated response. Please do not reply to this email.</p>
        <p>If you need immediate assistance, you can reach me directly at anshuman@biswas.me</p>
    </div>
</body>
</html>
`, emailConfig.FromEmail, subject, msg.Email, getFirstName(msg.Name))

	// Send email via configured provider
	var err error
	if emailConfig.Provider == "mailpit" {
		err = sendEmailViaMailpit(msg.Email, subject, body)
	} else {
		// For Brevo, extract HTML content from body
		htmlContent := extractHTMLFromEmailBody(body)
		err = sendEmailViaBrevo(msg.Email, subject, htmlContent)
	}

	if err != nil {
		return fmt.Errorf("failed to send auto-reply email: %v", err)
	}

	logger.Info("Auto-reply email sent successfully", zap.String("to", msg.Email), zap.String("provider", emailConfig.Provider))
	return nil
}

func getEnvWithDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func sendEmailViaProvider(to, subject, body string) error {
	switch emailConfig.Provider {
	case "brevo":
		return sendEmailViaBrevo(to, subject, body)
	case "mailpit":
		return sendEmailViaMailpit(to, subject, body)
	default:
		return fmt.Errorf("unsupported email provider: %s", emailConfig.Provider)
	}
}

func sendEmailViaMailpit(to, subject, body string) error {
	smtpAddr := fmt.Sprintf("%s:%s", emailConfig.MailpitSMTPHost, emailConfig.MailpitSMTPPort)
	return smtp.SendMail(smtpAddr, nil, emailConfig.FromEmail, []string{to}, []byte(body))
}

func sendEmailViaBrevo(to, subject, bodyHTML string) error {
	// Brevo API payload
	payload := map[string]interface{}{
		"sender": map[string]string{
			"email": emailConfig.FromEmail,
			"name":  "Anshuman Biswas",
		},
		"to": []map[string]string{
			{
				"email": to,
			},
		},
		"subject":     subject,
		"htmlContent": bodyHTML,
	}

	payloadBytes, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("failed to marshal Brevo payload: %v", err)
	}

	req, err := http.NewRequest("POST", "https://api.brevo.com/v3/smtp/email", bytes.NewBuffer(payloadBytes))
	if err != nil {
		return fmt.Errorf("failed to create Brevo request: %v", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", emailConfig.BrevoAPIKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send Brevo email: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("Brevo API returned status %d", resp.StatusCode)
	}

	return nil
}

func extractHTMLFromEmailBody(emailBody string) string {
	// Find the HTML content between <!DOCTYPE html> and </html>
	start := strings.Index(emailBody, "<!DOCTYPE html>")
	if start == -1 {
		return emailBody // Return as-is if no HTML found
	}
	
	end := strings.Index(emailBody, "</html>") + len("</html>")
	if end == -1 {
		return emailBody[start:] // Return from DOCTYPE to end
	}
	
	return emailBody[start:end]
}

func getFirstName(fullName string) string {
	parts := strings.Fields(fullName)
	if len(parts) > 0 {
		return parts[0]
	}
	return fullName
}

func handleBlogPosts(w http.ResponseWriter, r *http.Request) {
	enableCORS(w)
	w.Header().Set("Content-Type", "application/json")

	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != "GET" {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "Only GET method allowed"})
		return
	}

	// Check if blog API token is configured
	if blogConfig.APIToken == "" {
		logger.Error("Blog API token not configured")
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "Blog API not configured"})
		return
	}

	// Fetch posts from external blog API
	posts, err := fetchBlogPosts()
	if err != nil {
		logger.Error("Failed to fetch blog posts", zap.Error(err))
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(Response{Status: "error", ErrorMessage: "Failed to fetch blog posts"})
		return
	}

	logger.Info("Blog posts fetched successfully", 
		zap.String("ip", getClientIP(r)),
		zap.Int("post_count", len(posts)),
	)

	// Return the posts
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(posts)
}

func fetchBlogPosts() ([]BlogPost, error) {
    // Create HTTP client with timeout
    client := &http.Client{
        Timeout: 10 * time.Second,
    }

    // Create request to blog API
    // Normalize BLOG_API_URL to avoid double slashes
    base := strings.TrimRight(blogConfig.APIURL, "/")
    apiURL := fmt.Sprintf("%s/api/posts/formatted", base)
	req, err := http.NewRequest("GET", apiURL, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %v", err)
	}

	// Add authorization header
	req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", blogConfig.APIToken))
	req.Header.Set("Accept", "application/json")

	// Add Cloudflare Access headers if available
	if blogConfig.CFAccessClientID != "" && blogConfig.CFAccessSecret != "" {
		req.Header.Set("CF-Access-Client-Id", blogConfig.CFAccessClientID)
		req.Header.Set("CF-Access-Client-Secret", blogConfig.CFAccessSecret)
		logger.Info("Adding CF Access headers to blog API request")
	}

	// Make the request
	resp, err := client.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to make request: %v", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("blog API returned status %d", resp.StatusCode)
	}

	// Parse response
	var posts []BlogPost
	if err := json.NewDecoder(resp.Body).Decode(&posts); err != nil {
		return nil, fmt.Errorf("failed to decode response: %v", err)
	}

	logger.Info("Successfully fetched blog posts",
		zap.String("api_url", apiURL),
		zap.Int("post_count", len(posts)),
	)

	return posts, nil
}
