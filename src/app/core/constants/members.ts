export interface DropDwonItem {
  id: number;
  text: string;
}

export const ROLEITEMS: DropDwonItem[] = [
  {
    id: 2,
    text: 'View Only',
  },
  {
    id: 3,
    text: 'Create & Edit',
  },
];

export const APPROVALAMOUNT: DropDwonItem[] = [
  {
    id: 1000,
    text: '$1,000',
  },
  {
    id: 2000,
    text: '$2,000',
  },
  {
    id: 5000,
    text: '$5,000',
  },
  {
    id: 7500,
    text: '$7,500',
  },
  {
    id: 10000,
    text: '$10,000+',
  },
];
