import { NetworkDevice } from "./NetworkDevice";

export function IC10Configurator( props ) {
    /*const {d0, setd0} = useState();
    const {d1, setd1} = useState();
    const {d2, setd2} = useState();
    const {d3, setd3} = useState();
    const {d4, setd4} = useState();
    const {d5, setd5} = useState();
    const {db, setdb} = useState();*/

    return (
        <div>
            <div className="boxed">
                <NetworkDevice port="d0" />
                <NetworkDevice port="d1" />
                <NetworkDevice port="d2" />
                <NetworkDevice port="d3" />
                <NetworkDevice port="d4" />
                <NetworkDevice port="d5" />
            </div>
        </div>
    );
};