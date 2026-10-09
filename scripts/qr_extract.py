"""QR recovery v4: locate finder patterns, warp to canonical square, decode."""
import cv2
import numpy as np
import zxingcpp

SRC = r"C:\Users\smile\Downloads\image.jpg"
PUB = r"C:\Users\smile\OneDrive\Documents\github\whs-wreath-fundraiser\public"

flyer = cv2.imread(SRC)
crop = flyer[336:412, 232:323]
up = cv2.resize(crop, None, fx=6, fy=6, interpolation=cv2.INTER_CUBIC)
gray = cv2.cvtColor(up, cv2.COLOR_BGR2GRAY)
bw = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
                           cv2.THRESH_BINARY_INV, 61, 11)

contours, hierarchy = cv2.findContours(bw, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
hier = hierarchy[0]
cands = []
for i, (nxt, prv, child, par) in enumerate(hier):
    # finder pattern: contour with child with child (3 nested levels), roughly square
    if child == -1:
        continue
    c1 = hier[child]
    if c1[2] == -1:
        continue
    area = cv2.contourArea(contours[i])
    if area < 800:
        continue
    peri = cv2.arcLength(contours[i], True)
    approx = cv2.approxPolyDP(contours[i], 0.04 * peri, True)
    if len(approx) != 4:
        continue
    M = cv2.moments(contours[i])
    if M["m00"] == 0:
        continue
    cands.append((area, (M["m10"] / M["m00"], M["m01"] / M["m00"]), approx.reshape(4, 2)))

cands.sort(reverse=True)
print("finder candidates:", len(cands))
S = 500
ok = False
if len(cands) >= 3:
    pts = np.array([c[1] for c in cands[:3]], np.float32)
    # order: top-left = point farthest from the other two's... use standard trick
    d = np.linalg.norm(pts[:, None] - pts[None, :], axis=2)
    # right-angle corner = TL (legs differ most from hypotenuse pattern); simpler: TL has two similar distances
    order = []
    for i in range(3):
        others = sorted([d[i][j] for j in range(3) if j != i])
        order.append(abs(others[0] - others[1]))
    tl = int(np.argmin(order))
    rest = [i for i in range(3) if i != tl]
    # of rest: top-right has smaller y
    tr, bl = (rest[0], rest[1]) if pts[rest[0]][1] < pts[rest[1]][1] else (rest[1], rest[0])
    src_tri = np.array([pts[tl], pts[tr], pts[bl]], np.float32)
    dst_tri = np.array([[60, 60], [S - 60, 60], [60, S - 60]], np.float32)
    M = cv2.getAffineTransform(src_tri, dst_tri)
    warp = cv2.warpAffine(gray, M, (S, S), flags=cv2.INTER_CUBIC)
    cv2.imwrite(f"{PUB}/paypal-qr-warp-debug.png", warp)
    for name, v in {"warp": warp,
                    "warp-bin": cv2.threshold(warp, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]}.items():
        for res in zxingcpp.read_barcodes(v):
            print(f"ZXING {name}: {res.text[:200]}")
            ok = True
        data, _, _ = cv2.QRCodeDetector().detectAndDecode(v)
        if data:
            print(f"OCV {name}: {data[:200]}")
            ok = True
print("decoded!" if ok else "warp failed — keeping enlargement only")

# Final deliverable regardless: clean 900px enlargement of full code.
best = cv2.resize(crop, (900, 760), interpolation=cv2.INTER_LANCZOS4)
cv2.imwrite(f"{PUB}/paypal-qr.png", best)
print("saved paypal-qr.png", best.shape[1], "x", best.shape[0])
