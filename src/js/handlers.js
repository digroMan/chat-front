import { WS } from './constants';

export const handleRemoveMessage = (e) => {
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
