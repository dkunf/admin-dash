export function inputIsValid(obj: { name: string; value: string | number }[]) {
  obj.map((obj) => {
    if (typeof obj.value === "number") return true;
    else if (obj.value === "") return false;

    return true;
  });
}
