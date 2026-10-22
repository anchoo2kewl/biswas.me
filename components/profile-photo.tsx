import Image from "next/image";

export function ProfilePhoto() {
  return (
    <figure className="p-profile-photo">
      <Image src="/anshuman-biswas-portrait.jpg" alt="Anshuman Biswas on an autumn woodland path" width={600} height={600} priority sizes="(max-width: 700px) 80vw, 360px" />
    </figure>
  );
}
