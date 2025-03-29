import React from 'react'
import heart from '../../assets/heart.svg'
import { DynamicStars } from '../dynamic_stars/DynamicStars';

const ServiceItem = ({ data }) => {
  return (
    <>
    {data?.length > 0 &&
      data.map((serv) => {
        const formattedPrice = (serv.price ?? 0).toLocaleString("id-ID", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return (
          <div key={serv.id} className="w-sm h-110 font-inter">
            <div className="overflow-hidden h-70">
              <img className="w-full h-full object-cover" src={serv.image} alt="phone" />
            </div>
            <div className="p-3 flex flex-col gap-3">
              <div className="flex flex-row gap-10">
                <p className="text-wrap font-Archivo font-bold text-xl">{serv.title}</p>
                <img className="self-start" src={heart} alt="like" />
              </div>
              <p className="font-bold font-inter text-xl">Rp. {formattedPrice}</p>
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

export default ServiceItem