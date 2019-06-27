import ICCRemover from './ICCRemover'

String.prototype.toNormalCase = function () {
  return this[0].toUpperCase() + this.substr(1).toLowerCase().replace(/_/g, ' ');
};

export async function downloadBuff (url) {
  let response = await fetch(url);

  if (response.ok) {
    let buff = await response.arrayBuffer();
    return { response, buff, err: '' };
  } else return { response, buff: null, err: 'Got not OK response (' + response.status + ')' };
}

export function loadBuff (buff) {
  return new Promise((resolve, reject) => {
    buff = ICCRemover.clear(buff);

    if (!buff) reject('Couldn\'t parse PNG');

    let img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve(img);
    };
    img.src = URL.createObjectURL(new Blob([ buff ], { type: 'image/png' }));
  });
}

export async function loadImage (url) {
  let { response, err, buff } = await downloadBuff(url);

  if (err) return { response, err, img: null } ;

  return { response, err: '', img: await loadBuff(buff) };
}
