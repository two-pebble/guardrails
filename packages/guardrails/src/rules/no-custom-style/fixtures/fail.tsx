// This file should FAIL the no-custom-style rule
const App = () => {
  return (
    <div className="container" style={{ color: "red" }}>
      hello
    </div>
  );
};
