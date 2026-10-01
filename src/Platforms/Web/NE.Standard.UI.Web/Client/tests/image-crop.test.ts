// The crop's arithmetic: the square a frame holds at a zoom and a pan, kept inside the picture, a zoom that keeps the point under the
// pointer where it is, the side and the type the crop is written in, and how far a large photo is scaled down as it is decoded.

import assert from "node:assert/strict";
import test from "node:test";
import { centredView, clampView, cropFileName, cropOutputSide, cropOutputType, cropRect, cropScale, MaxCropZoom, panView, workingScale, zoomView } from "../src/interactions/image-crop.ts";

const landscape = { width: 800, height: 600 };

test("a picture opens filling the frame, centred: the frame holds its short side", () => {
    assert.deepEqual(cropRect(landscape, centredView(landscape)), { x: 100, y: 0, side: 600 });
});

test("a drag moves the picture by the screen's distance at the frame's scale, and never past an edge", () => {
    const view = centredView(landscape);

    // A 300-pixel frame shows 600 of the picture's pixels: a screen pixel is two of the picture's.
    assert.equal(cropScale(landscape, view, 300), 0.5);
    assert.deepEqual(panView(landscape, view, 300, 30, 0), { x: 340, y: 300, zoom: 1 });

    const far = cropRect(landscape, panView(landscape, view, 300, 5000, -5000));

    assert.deepEqual(far, { x: 0, y: 0, side: 600 });

    // A frame not laid out moves nothing rather than everything.
    assert.deepEqual(panView(landscape, view, 0, 30, 0), view);
});

test("a zoom about a point keeps the picture's point under it there", () => {
    const view = centredView(landscape);
    const about = { x: 60, y: -30 };
    const zoomed = zoomView(landscape, view, 300, 2, about);
    const pointBefore = { x: view.x + (about.x / cropScale(landscape, view, 300)), y: view.y + (about.y / cropScale(landscape, view, 300)) };
    const pointAfter = { x: zoomed.x + (about.x / cropScale(landscape, zoomed, 300)), y: zoomed.y + (about.y / cropScale(landscape, zoomed, 300)) };

    assert.equal(zoomed.zoom, 2);
    assert.deepEqual(pointAfter, pointBefore);
    assert.deepEqual(cropRect(landscape, zoomed), { x: 310, y: 120, side: 300 });
});

test("the zoom stays between filling the frame and its closest, and the frame stays covered as it goes back out", () => {
    const view = centredView(landscape);

    assert.equal(zoomView(landscape, view, 300, 0.5).zoom, 1);
    assert.equal(zoomView(landscape, view, 300, 100).zoom, MaxCropZoom);

    // Zoomed in at the right edge, then out: the wider square is pushed back inside.
    const atEdge = panView(landscape, zoomView(landscape, view, 300, 4), 300, -10000, 0);
    const out = cropRect(landscape, zoomView(landscape, atEdge, 300, 0.25));

    assert.deepEqual(out, { x: 200, y: 0, side: 600 });
    assert.deepEqual(clampView(landscape, { x: -50, y: 900, zoom: 9 }), { x: 75, y: 525, zoom: MaxCropZoom });
});

test("the crop is written at the frame's own pixels up to the size asked, never scaled up", () => {
    assert.equal(cropOutputSide({ x: 0, y: 0, side: 600 }, 1024), 600);
    assert.equal(cropOutputSide({ x: 0, y: 0, side: 3000 }, 1024), 1024);
    assert.equal(cropOutputSide({ x: 0, y: 0, side: 150.4 }, 256), 150);
    assert.equal(cropOutputSide({ x: 0, y: 0, side: 0.2 }, 256), 1);
});

test("a large photo is decoded no larger than the closest zoom needs, and no more than a 4096 square's pixels", () => {
    assert.equal(workingScale({ width: 1000, height: 800 }, 1024), 1);
    // A phone's 12 megapixels are kept whole at 1024; a camera's 48 are held to a 4096 square's pixels.
    assert.equal(workingScale({ width: 4032, height: 3024 }, 1024), 1);
    assert.equal(workingScale({ width: 8000, height: 6000 }, 1024), Math.sqrt((4096 * 4096) / (8000 * 6000)));
    // An avatar at 256 needs no more than 1024 on the short side.
    assert.equal(workingScale({ width: 4032, height: 3024 }, 256), 1024 / 3024);
});

test("a JPEG, PNG or WebP keeps its type; anything else is written as a PNG and named for it", () => {
    assert.equal(cropOutputType("image/jpeg"), "image/jpeg");
    assert.equal(cropOutputType("image/webp"), "image/webp");
    assert.equal(cropOutputType("image/gif"), "image/png");
    assert.equal(cropOutputType("image/heic"), "image/png");

    assert.equal(cropFileName("holiday.jpeg", "image/jpeg", "image/jpeg"), "holiday.jpeg");
    assert.equal(cropFileName("IMG_0042.HEIC", "image/heic", "image/png"), "IMG_0042.png");
    // A browser that cannot write WebP answers a PNG, and the name follows what it wrote.
    assert.equal(cropFileName("sticker.webp", "image/webp", "image/png"), "sticker.png");
    assert.equal(cropFileName("scan", "image/bmp", "image/jpeg"), "scan.jpg");
});
