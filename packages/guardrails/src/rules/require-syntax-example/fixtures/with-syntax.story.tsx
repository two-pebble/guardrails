import { SyntaxExample } from "./syntax-example";

const meta = { title: "Test" };
export default meta;

export const Default = {
  render: () => (
    <SyntaxExample code="<Button />">
      <button type="button">Click</button>
    </SyntaxExample>
  ),
};
