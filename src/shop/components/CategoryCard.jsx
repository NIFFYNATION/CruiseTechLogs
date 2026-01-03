import React from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

const CategoryCard = ({
  image,
  title,
  subtitle,
  link = "#",
  variants,
  className = ""
}) => {
  return (
    <motion.div variants={variants} className={`h-full ${className}`}>
      <Link
        to={link}
        className="group relative block w-full h-full overflow-hidden rounded-[2rem] bg-gray-100 aspect-[4/5] md:aspect-[3/4]"
      >
        {/* Image Background */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-110"
          style={{ backgroundImage: `url('${image}')` }}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 transition-opacity duration-300" />

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
          <div className="transform transition-transform duration-300 group-hover:-translate-y-2">
            <span className="inline-block px-3 py-1 mb-3 text-[10px] font-bold tracking-widest text-white uppercase bg-white/20 backdrop-blur-md rounded-full border border-white/10 shadow-sm">
              Collection
            </span>
            <h3 className="text-2xl font-bold text-white leading-tight mb-1 [text-shadow:_0_1px_4px_rgba(0,0,0,0.8)]">{title}</h3>
            <p className="text-sm text-gray-200 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 h-0 group-hover:h-auto drop-shadow-sm">
              {subtitle}
            </p>
          </div>

          {/* Action Button */}
          <div className="absolute bottom-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
            <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full text-[#0f1115] shadow-lg">
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
