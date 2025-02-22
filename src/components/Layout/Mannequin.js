// src/components/Layout/Mannequin.js
import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function Mannequin() {
  return (
    <Svg width={200} height={400} viewBox="0 0 200 400">
      <Path
        d="M100,20 
           C80,20, 70,40, 70,60 
           L70,120 
           C70,140, 80,160, 100,160 
           C120,160, 130,140, 130,120 
           L130,60 
           C130,40, 120,20, 100,20 
           Z
           M70,120 
           L70,220 
           C70,240, 80,260, 100,260 
           C120,260, 130,240, 130,220 
           L130,120 
           Z
           M90,260 
           L90,350 
           C90,370, 110,370, 110,350 
           L110,260 
           Z"
        fill="#ccc"
      />
    </Svg>
  );
}
