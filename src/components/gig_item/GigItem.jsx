import React from 'react'
import heart from '../../assets/heart.svg'
import { DynamicStars } from '../dynamic_stars/DynamicStars';

const GigItem = ({ data }) => {
  return (
    <>
    {data?.length > 0 &&
      data.map((serv) => {
        const formattedPrice = (price, locale = "id-ID", minFraction = 2, maxFraction = 2) => {
          return (price ?? 0).toLocaleString(locale, {
            minimumFractionDigits: minFraction,
            maximumFractionDigits: maxFraction,
          });
        };

        return (
          <div key={serv.id} className="w-sm h-110 font-inter">
            <div className="overflow-hidden h-70">
              <img className="w-full h-full object-cover bg-black" src={serv.image} alt="phone" />
            </div>
            <div className="p-3 flex flex-col gap-3">
              <div className="flex flex-row justify-between">
                <p className="text-wrap font-Archivo font-bold text-xl bg-red-200 max-w-80">{serv.name}</p>
                <img className="self-end" src={heart} alt="like" />
              </div>
              <div className='flex flex-row justify-between'>
              <p className="font-bold font-inter text-xl">Rp. {formattedPrice(data.minPrice)}</p>
              <p className="font-bold font-inter text-xl">-</p>
              <p className="font-bold font-inter text-xl">Rp. {formattedPrice(data.maxPrice)}</p>

              </div>
              <div className="flex flex-row justify-between">
                <DynamicStars number={serv.rating} type="service" />
                <p className="font-inter text-xs self-center">{serv.sold} items sold</p>
              </div>
            </div>
          </div>
        );
      })}
  </>
  )
}

export default GigItem