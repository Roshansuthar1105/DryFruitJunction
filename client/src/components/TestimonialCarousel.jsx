import { useState, useEffect } from 'react';

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [
    {
      image: "https://img.freepik.com/free-photo/nagpur-orange-burfee-barfi-burfi-is-creamy-fudge-made-with-fresh-oranges-mawa_466689-72287.jpg",
      quote: "The orange burfi was absolutely delicious!",
      author: "Ramesh P., Nagpur"
    },
      {
        image: "https://res.cloudinary.com/dqlf0ni1a/image/upload/v1750524159/sweet-delights/products/dncgqm8bzdgqzzhrntgm.png",
        quote: "The classic Kaju Katli melts in your mouth—pure indulgence!",
        author: "Neha R., Bangalore"
      },
      {
        image: "https://res.cloudinary.com/dqlf0ni1a/image/upload/v1750524223/sweet-delights/products/qv4rlhdthcglmebz72lx.jpg",
        quote: "Mango Kaju Katli is summer in a bite! So fragrant and smooth.",
        author: "Rahul K., Hyderabad"
      },
      {
        image: "https://res.cloudinary.com/dqlf0ni1a/image/upload/v1750524282/sweet-delights/products/i2i7tvigdpundfvyqqhu.jpg",
        quote: "Strawberry Kaju Katli—a playful twist on tradition. Loved it!",
        author: "Ananya P., Pune"
      },
      {
        image: "https://res.cloudinary.com/dqlf0ni1a/image/upload/v1750523859/sweet-delights/products/qrbeecheoxgeaysqllzd.png",
        quote: "Panch Mewa Burfi is fit for royalty! Rich, nutty, and heavenly.",
        author: "Vikram D., Jaipur"
      }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
      <div className="relative z-10 px-5 h-[70dvh]">
        <div className="relative h-full rounded-3xl overflow-hidden shadow-2xl w-full max-h-[70dvh]">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-2500 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={testimonial.image}
                alt={testimonial.quote}
                width={500}
                height={600}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                <p className="text-lg font-medium">"{testimonial.quote}"</p>
                <p className="text-sm mt-2">- {testimonial.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
  );
}