import { motion } from 'framer-motion';
import { BiDumbbell, BiLeaf, BiLemon, BiVideo } from 'react-icons/bi';

export default function IntroIcon() {
  return (
    <div className='py-1 px-8 bg-white'>
      <motion.div
        className='flex justify-center gap-22 flex-wrap'
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        viewport={{ once: true, amount: 0.5 }}
      >
        <div className='flex flex-col items-center text-teal-400'>
          <BiLeaf className='text-5xl mb-2' />
          <h3 className='font-semibold text-lg'>HEALTHY Life</h3>
        </div>

        <div className='flex flex-col items-center text-teal-400'>
          <BiDumbbell className='text-5xl mb-2' />
          <h3 className='font-semibold text-lg'>YOGA Studio</h3>
        </div>

        <div className='flex flex-col items-center text-teal-400'>
          <BiLemon className='text-5xl mb-2' />
          <h3 className='font-semibold text-lg'>ORGANIC Cosmetics</h3>
        </div>

        <div className='flex flex-col items-center text-teal-400'>
          <BiLeaf className='text-5xl mb-2' />
          <h3 className='font-semibold text-lg'>FLORA BEAUTY</h3>
        </div>

        <div className='flex flex-col items-center text-teal-400'>
          <BiVideo className='text-5xl mb-2' />
          <h3 className='font-semibold text-lg'>YOGA</h3>
        </div>
      </motion.div>
    </div>
  );
}
