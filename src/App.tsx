import './App.css'
import Assets from "./components/Assets.tsx";
import {ChainlinkAssetService} from "@/services/ChainlinkAssetService.ts";

function App() {
    const service = new ChainlinkAssetService();
    return (
        <>
        <Assets
            service={service}
            targetAmount={1000}
            onAllocationChange={(state) => {
                console.log('Allocation changed:', state);
            }}
            onPurchase={(state) => {
                console.log('Purchase triggered:', state);
            }}
        />
    </>
  )
}

export default App
