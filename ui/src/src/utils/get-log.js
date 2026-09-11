import Techno4 from 'techno4';

export default function (self, url) {
  Techno4.request.json(url).then(({ data }) => {
    if (data.done) {
      self.done = true;
    }
    if (data.error) {
      self.error = true;
    }
    self.log = data.log;
    if (self.done || self.error) return;
    setTimeout(() => {
      self.getLog();
    }, 1000);
  });
}
