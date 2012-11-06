/**
 * @function
 * @param {Int} x1
 * @param {Int} y1
 * @param {Int} x2
 * @param {Int} y2
 * @param {Int} dashLen
 */
CanvasRenderingContext2D.prototype.dashedLine = function(x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;

    this.beginPath();
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);

    this.stroke();
    this.closePath();
};

/**
 * @function
 * @param {Int} x1
 * @param {Int} y1
 * @param {Int} x2
 * @param {Int} y2
 */
CanvasRenderingContext2D.prototype.solidLine = function(x1, y1, x2, y2) {
    this.beginPath();
    this.lineTo(x1, y1);
    this.lineTo(x2, y2);
    this.stroke();
    this.closePath();
};
