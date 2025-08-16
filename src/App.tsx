import './App.css'
import {ChainlinkAssetService} from "@/services/ChainlinkAssetService.ts";
import {SEPOLIA_CONFIG} from "@/config";
import {Assets} from "@/components/Assets.tsx";

function App() {
    const service = new ChainlinkAssetService(SEPOLIA_CONFIG);
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
