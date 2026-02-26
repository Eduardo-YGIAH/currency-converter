import { Card } from "./components/Card/Card";
import { ConversionLayout } from "./components/Conversion/ConversionLayout";
import { PageContainer } from "./components/Layout/PageContainer";

function App() {
  return (
    <PageContainer>
      <Card>
        <ConversionLayout />
      </Card>
    </PageContainer>
  );
}

export default App;