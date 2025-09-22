const grid = (widthCm, heightCm) => {
  const unitSize = 15; // سم لكل مربع

  const cols = Math.max(1, Math.round(widthCm / unitSize));  // عدد المربعات عرضاً
  const rows = Math.max(1, Math.round(heightCm / unitSize)); // عدد المربعات طولاً

  const width = cols * unitSize;
  const height = rows * unitSize;

  var points = [];

  // خطوط أفقية
  for (let i = 0; i <= rows; i++) {
    const y = (height / 2) - i * unitSize;
    points.push(new THREE.Vector3(-width / 2, y, 0.1));
    points.push(new THREE.Vector3(+width / 2, y, 0.1));
  }

  // خطوط عمودية
  for (let i = 0; i <= cols; i++) {
    const x = -width / 2 + i * unitSize;
    points.push(new THREE.Vector3(x, +height / 2, 0.1));
    points.push(new THREE.Vector3(x, -height / 2, 0.1));
  }

  const gridColor = document.darkMode ? 0xffffff : 0x000000;

  const gridMaterial = new THREE.LineBasicMaterial({
    color: gridColor,
    transparent: true,
    opacity: 0.6
  });

  var geometry = new THREE.BufferGeometry().setFromPoints(points);
  var line = new THREE.LineSegments(geometry, gridMaterial);
  line.position.z = 0.01;

  scene.add(line);
  return line;
};
