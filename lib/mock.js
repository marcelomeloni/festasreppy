// lib/mock.js — dados mockados para o checkout

export const mockEvent = {
  id: "evt_calourada_fauusp_2026",
  title: "Calourada FAUUSP 2026",
  organizer: "Centro Acadêmico FAU",
  date: "Sábado, 14 de março de 2026",
  time: "22h00 — 05h00",
  venue: "Largo São Bento, 210 — São Paulo",
  image: null, // sem imagem real, usaremos gradiente
  category: "Festa Universitária",
  badge: "🔥 Quase esgotado",
};

export const mockCart = {
  items: [
    {
      id: "lote_1",
      name: "Pista · Lote 2",
      price: 2500,
      quantity: 2,
    },
  ],
  fees: 150, // taxa de serviço por ingresso, em centavos
  subtotal: 5000,
  totalFees: 300,
  total: 5300,
};

export const PIX_EXPIRY_SECONDS = 15 * 60; // 15 minutos

export const mockPixPayload = {
  key: "pagamentos@reppy.com.br",
  code: "00020101021226580014br.gov.bcb.pix0136a629532e-7693-4846-852d-1bbff817b5a8520400005303986540553.005802BR5915Reppy Pagamentos6009Sao Paulo62140510reppy20266304A2B3",
  qrCodeUrl: null, // gerado via canvas
};