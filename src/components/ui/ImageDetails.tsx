import Image from 'next/image';

const ImageDetails = ({ src }) => (
  <figure className="title-image overlap-banner relative rounded bg-white">
    <Image
      className="w-[300px] h-[380px] object-scale-down object-center mx-auto"
      src={src}
      fill
      alt="Details"
      unoptimized
    />
  </figure>
);

export default ImageDetails;
