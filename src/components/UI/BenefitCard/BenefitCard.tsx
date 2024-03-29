interface BenefitCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  image: {
    src: string;
    alt: string;
  };
}

export default function BenefitCard({
  description,
  title,
  image,
}: BenefitCardProps) {
  return (
    <div className="relative w-full h-full hover:scale-[101%] scale-100 duration-500">
      <div className="absolute inset-0 flex flex-col md:px-24 px-8 py-16 md:py-40 justify-end z-10">
        <div className="md:h-1/2 flex justify-between flex-col">
          <h2 className="text-black md:text-5xl mb-2 md:mb-0">{title}</h2>
          <p className="text-black font-semibold text-xl">{description}</p>
        </div>
      </div>
      <img
        src={image.src}
        alt="blur"
        className="absolute inset-0 blur-3xl object-cover translate-x-20 translate-y-24 scale-110 sm:opacity-70 opacity-20"
      />
      <img
        {...image}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
