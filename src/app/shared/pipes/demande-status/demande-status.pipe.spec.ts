import { DemandeStatusPipe } from '../demandeStatus/demande-status.pipe';

describe('DemandeStatusPipe', () => {
  it('create an instance', () => {
    const pipe = new DemandeStatusPipe();
    expect(pipe).toBeTruthy();
  });
});
