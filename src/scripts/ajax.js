export default function ajax (method, responseType, url, load, error, progress) {
  let xhr = new XMLHttpRequest();

  xhr.responseType = responseType;
  xhr.onload = load;

  if (progress) xhr.onprogress = progress;
  if (error)    xhr.onerror    = error;

  xhr.open(method, url);
  xhr.send();

  return xhr;
}
