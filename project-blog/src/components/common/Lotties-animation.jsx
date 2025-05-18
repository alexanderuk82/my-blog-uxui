import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Configuración centralizada de las animaciones
export const LOTTIE_ANIMATIONS = {
  PAYMENT_SUCCESS: {
    src: "https://lottie.host/938dfebc-d558-462f-91e7-9dbbc84ef33a/EauIwNHUlK.lottie",
    loop: true,
    autoplay: true,
    style: {
      width: '200px',
      height: '200px'
    }
  },
  PAYMENT_CANCEL: {
    src: "https://lottie.host/cadc54e9-e135-42eb-9c35-e4e0785ce100/m7GpizpLke.lottie",
    loop: false,
    autoplay: true,
    style: {
      width: '200px',
      height: '200px'
    }
  },
  CANCELED_ORDER_INVALID: {
    src: "https://lottie.host/344c9a85-c248-440f-a871-1f95ea9a187e/QKUER1u61L.lottie",
    loop: true,
    autoplay: true,
    style: {
      width: '200px',
      height: '200px'
    }
  }
};

// Componente reutilizable para las animaciones
const LottieAnimation = ({ name, style }) => {
  const animation = LOTTIE_ANIMATIONS[name];
  if (!animation) return null;

  return (
    <DotLottieReact
      {...animation}
      style={{ ...animation.style, ...style }}
    />
  );
};

export default LottieAnimation;