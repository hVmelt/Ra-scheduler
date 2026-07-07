export const defaultAvail = () => ({
  sun: true,
  mon: true,
  tue: true,
  wed: true,
  thu: true,
  weekend: true,
});

export const makeDefaultRAs = () =>
  Array.from({ length: 11 }, (_, i) => ({
    id: i + 1,
    name: '',
    avail: defaultAvail(),
    override: null,
  }));
