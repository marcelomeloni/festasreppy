export const eventMock = {
  title: "PDA + ATF26",
  date: "Domingo, 01/03 às 18:00 até 23:59",
  locationName: "Bar CONTAINER",
  // locationAddress foi substituído pelo objeto detalhado abaixo
  address: {
    street: "Rua José do Patrocínio, 8",
    neighborhood: "Centro",
    city: "Pelotas",
    state: "RS",
    zipCode: "96015-160"
  },
  description: "O pagode das atléticas mais estourado da região. Fisioterapia ATF26 apresenta...\n\nChegue cedo, evite filas.",
  organizer: "Pagode das Atléticas",
  ageRestriction: "Proibido menores de 18",
  documents: "Documento oficial com foto",
  refundPolicy: "A solicitação de cancelamento pode ser feita em até 7 dias corridos após a compra, desde que seja feita antes de 48 horas do início do evento.",
  
  ticketPrice: 40,
  organizationFeePercent: 10,
};

export type EventType = typeof eventMock;