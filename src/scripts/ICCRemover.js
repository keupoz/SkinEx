const SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

class ICCRemover {
  clear (arrayBuffer) {
    this.bytes = new Uint8Array(arrayBuffer);
    this.index = 0;

    if (SIGNATURE.some(byte => byte !== this.read8())) return null;

    let iccStart, iccLength = 0;

    while (this.index < this.bytes.length) {
      let length = this.readLength();

      if (this.readType() == 'iCCP') {
        iccStart  = this.index - 8;
        iccLength = length + 12;
        break;
      } else this.skip(length + 4);
    }

    if (!iccStart) return this.bytes;

    let newBytes = Array.from(this.bytes);
    newBytes.splice(iccStart, iccLength);

    return new Uint8Array(newBytes);
  }

  raw (length) {
    return this.bytes.slice(this.index, this.index += length);
  }

  read8 () {
    return this.bytes[this.index++];
  }

  readLength () {
    return (this.read8() << 24 | this.read8() << 16 | this.read8() << 8 | this.read8()) >>> 0;
  }

  readType () {
    return String.fromCharCode(...this.raw(4));
  }

  skip (length) {
    this.index += length;
  }

  back (length) {
    this.index -= length;
  }
}

export default new ICCRemover()
