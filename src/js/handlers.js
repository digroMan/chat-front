import { WS } from './constants';

export const handleRemoveMessage = (e) => {
  console.log(e.target);
  const { id } = e.target.dataset;
  WS.send(JSON.stringify({
    type: 'delete',
    data: { id },
  }));
};

export const handleRemoveMessage1 = (id) => {
  WS.send(JSON.stringify({
    type: 'delete',
    data: id,
  }));
};
