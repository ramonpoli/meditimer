import Link from "next/link";

const Footer = () => {
  return (
    <footer className="text-[var(--text-color-muted)] self-start">
      <Link
        href={"https://raypoly.netlify.app"}
        target="_blank"
        rel="noreferrer"
        className="underline"
      >
        Ray Poly
      </Link>
    </footer>
  );
};

export default Footer;
