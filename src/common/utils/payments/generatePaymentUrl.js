import CryptoJS from 'crypto-js';


const generatePaymentURL = (newOrderId) => {
    const liqpayData = {
      public_key: 'sandbox_i38312250017',
      version: '3',
      action: 'pay',
      subscribe_periodicity: 'month',
      amount: '55',
      currency: 'UAH',
      description: 'Description',
      order_id: newOrderId, // Используем новый orderId
      sandbox: 'sandbox',
      return_url: 'http://localhost:3000/final'
    };

    const liqpayDataStr = btoa(JSON.stringify(liqpayData));
    const signString = `sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY${liqpayDataStr}sandbox_FRDaasO0MmnhPbbp9U3d8DylKxr6ah8ppwkWKCcY`;
    const liqpaySignature = CryptoJS.SHA1(signString).toString(CryptoJS.enc.Base64);

    return `https://www.liqpay.ua/api/3/checkout?data=${liqpayDataStr}&signature=${liqpaySignature}`;
  };

  export default generatePaymentURL