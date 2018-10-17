const window = {};
const global = {};
importScripts('lib/three.min.js');
window.THREE = THREE;
importScripts('lib/csg.js', 'lib/ThreeCSG.js', 'intersectPartitions.js');

onmessage = function (e) {
    console.log('Message received from main script');
    const msg = e.data;
    if (msg.tag && msg.data) {
        const tag = msg.tag;
        const data = msg.data;

        switch (tag) {
            case "intersect":
                getIntersections(data.hull, data.partitions);
                break;

            default:
                break;
        }
    }
}
let getIntersections = function (hull, partitions) {
    console.log("asking for intersections...");

    parseObjectForCsg(hull);
    partitions.forEach(partition => parseObjectForCsg(partition));

    const result = getIntersectOfPartitionsWithHull(hull, partitions);
    console.log("got intersections");
    postMessage({ tag: "intersections", data: result });
}