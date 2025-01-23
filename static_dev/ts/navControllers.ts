const hambugerElement = document.querySelector(".hamburger");
const tournamentNavigationElement = document.querySelector(".tournament-navigation") as HTMLElement;

hambugerElement?.addEventListener("click", (e) => {
  let element = e.target as HTMLElement;
  if (!element.childElementCount) {
    element = element.parentElement as HTMLElement;
  }
  const currentStatus = element.dataset.status ?? "";
  const newStatus = currentStatus === "active" ? "" : "active";
  if (element) {
    element.dataset.status = newStatus;
  }
  if (tournamentNavigationElement) {
    tournamentNavigationElement.dataset.status = newStatus;
  }
});
