import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "./App";

test("check for buttons", () => {
  render(<App />);
  const buttons = screen.queryAllByText(/[1234567890/*-+]/i);
  expect(buttons).toHaveLength(13);
});
test("check addition", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "12+12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("24"));
});

test("check addition with manual clicks", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("1"));
  fireEvent.click(screen.getByText("2"));
  fireEvent.click(screen.getByText("+"));
  fireEvent.click(screen.getByText("1"));
  fireEvent.click(screen.getByText("2"));
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("24"));
});

test("check subtraction", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "12-12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("0"));
});

test("check subtraction with manual clicks", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("1"));
  fireEvent.click(screen.getByText("2"));
  fireEvent.click(screen.getByText("-"));
  fireEvent.click(screen.getByText("1"));
  fireEvent.click(screen.getByText("2"));
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("0"));
});

test("check multiplication", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "12*12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("144"));
});

test("check division", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "12/12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("1"));
});

test("check modulus op", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "3%2" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("1"));
});

test("check modulus with manual clicks", async () => {
  render(<App />);
  fireEvent.click(screen.getByText("3"));
  fireEvent.click(screen.getByText("%"));
  fireEvent.click(screen.getByText("2"));
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("1"));
});

test("check combination 1", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "24+123-123/2+12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("97.5"));
});

test("check combination 2", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: ".24*.123-123*2/2+.12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("-122.85047999999999"));
});

test("check combination 3", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "(.24*.123-123)*(2/2)+.12" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("-122.85047999999999"));
});

test("check combination 4", async () => {
  render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "(22.24*123123213.123-123)*(2123123/2)+.12111111" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByDisplayValue("2906831538270551"));
});

test("check for Malformed expression", async () => {
  const { container } = render(<App />);
  const input = screen.getByLabelText(/enter input/g);
  fireEvent.change(input, {
    target: { value: "(22.24*12312sdf3213.123-123)*(2123123/2)+.12111111" },
  });
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByText(/Malformed expression/i));
  expect(container.querySelector(".screen")).toHaveClass("error-active");
});

test("check for Malformed expression using manual clicks", async () => {
  const { container } = render(<App />);
  fireEvent.click(screen.getByText("3"));
  fireEvent.click(screen.getByText("%"));
  fireEvent.click(screen.getByText("%"));
  fireEvent.click(screen.getByText("2"));
  fireEvent.click(screen.getByText(/=/i));
  await waitFor(() => screen.getByText(/Malformed expression/i));
  expect(container.querySelector(".screen")).toHaveClass("error-active");
});
