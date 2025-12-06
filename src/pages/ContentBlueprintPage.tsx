import { Sidebar } from '../components/Sidebar';
import { BlueprintForm } from '../components/BlueprintForm';

export default function ContentBlueprintPage() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <BlueprintForm />
    </div>
  );
}
