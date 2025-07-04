import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import {
  AiFillGithub,
  AiFillLinkedin,
  AiFillMail,
  AiFillTwitterSquare,
} from "react-icons/ai";

// Custom SafeImage component with proper error handling
const SafeImage = ({ src, alt, width, height, className, objectFit }: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
}) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc("/default/default-avatar.png");
    }
  };

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{ objectFit: objectFit }}
      onError={handleError}
    />
  );
};

export interface IExpertItem {
  name: string;
  description?: string;
  image_url: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
  };
  skills: string[];
  slug?: string;
}

interface IExpertItemProps {
  expert: IExpertItem;
  imageHeight?: string;
  showLinks?: boolean;
}

export default function ExpertItem({
  expert,
  imageHeight = "h-44",
  showLinks = true,
}: IExpertItemProps) {
  return (
    <article className="xdev-expert flex flex-col w-full border-0.5 border-theme-border dark:border-theme-border-dark rounded-md bg-white dark:bg-secondary-dark-lighter shadow-sm overflow-hidden">
      <div className="w-full max-w-44 mx-auto mt-6">
        <div className={`mx-auto w-36 h-36 rounded-full shadow-lg overflow-hidden bg-gray-200 dark:bg-gray-700 border-2 border-primary/20 relative`}>
          <SafeImage
            src={expert.image_url || "/default/default-avatar.png"}
            alt={expert.name}
            width={144}
            height={144}
            objectFit="cover"
          />
        </div>
      </div>
      <div className="p-4 md:px-8 md:py-6 flex-grow">
        <div className="font-semibold text-theme-title dark:text-theme-title-dark text-base  sm:text-xl text-center">
          {expert.name}
        </div>
        {expert?.description && (
          <p className="text-theme-text dark:text-theme-text-dark text-xs sm:text-sm mt-3 text-center">
            {expert.description}
          </p>
        )}

        <p className="text-theme-title dark:text-theme-title-dark text-xs sm:text-sm mt-3 text-center">
          {expert.skills.map((skill) => `#${skill} `)}
        </p>
      </div>
      {showLinks && (
        <div className="flex text-theme-text dark:text-theme-text-dark py-5 border-t-0.5 border-theme-border dark:border-theme-border-dark divide-x-0.5 divide-theme-border dark:divide-theme-border-dark">
          {expert?.socials?.twitter && (
            <a
              href={expert.socials.twitter}
              target="_blank"
              className="flex-1 cursor-pointer"
              rel="noreferrer"
            >
              <div className="flex items-center justify-center">
                <AiFillTwitterSquare className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
          {expert?.socials?.linkedin && (
            <a
              href={expert.socials.linkedin}
              target="_blank"
              className="flex-1 cursor-pointer"
              rel="noreferrer"
            >
              <div className="flex items-center justify-center">
                <AiFillLinkedin className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
          {expert?.socials?.github && (
            <a
              href={expert.socials.github}
              target="_blank"
              className="flex-1 cursor-pointer"
              rel="noreferrer"
            >
              <div className="flex items-center justify-center">
                <AiFillGithub className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
          {expert?.socials?.email && (
            <a
              href={`mailto:${expert.socials.email}`}
              target="_blank"
              className="flex-1 cursor-pointer"
              rel="noreferrer"
            >
              <div className="flex items-center justify-center">
                <AiFillMail className="text-2xl sm:text-xl" />
              </div>
            </a>
          )}
        </div>
      )}
    </article>
  );
}
