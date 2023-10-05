export default function LaunchLine(props) {

    const { start, end } = props;

    if (!start || !end) return null;

    const length = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;
    const position = {
        left: start.x,
        top: start.y,
    };

    return (
        <div style={{
            position: 'absolute',
            transform: `rotate(${angle}deg)`,
            transformOrigin: '0 0',
            height: '2px',
            width: `${length}px`,
            backgroundColor: 'red',
            ...position
        }}
        />
    );
}