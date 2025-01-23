const infoTitle: NodeListOf<HTMLHeadingElement> = document.querySelectorAll(".title-row > h2");
const sections: NodeListOf<HTMLHeadingElement> = document.querySelectorAll("[section]");
const toggleButtons: NodeListOf<HTMLHeadingElement> | [] =
  document.querySelectorAll(".expand-button");

function toggleSectionStatus(element: HTMLElement): void {
  for (let i = 0; i < sections.length; i++) {
    const section: HTMLElement = sections[i];
    if (section.dataset.type === element.dataset.type) {
      section.dataset.status = element.dataset.status
    } else {
      section.dataset.status = "";
    }
  };
};

infoTitle.forEach((element: HTMLElement) => {
  element.addEventListener("click", (e) => {
    element.dataset.status = "active";
    
    const parent: HTMLElement | null = element.parentElement;
    
    if (parent) {
      const children: HTMLElement[] = Array.from(parent.children) as HTMLElement[];
      children.forEach((child: HTMLElement) => {
        if (child === element) return;
        child.dataset.status = "";
      });
    }
    toggleSectionStatus(element);
  });
});

function collapsableEvent(e: MouseEvent): void {
  const chevron = e.target as HTMLElement;

  let topParent: HTMLElement | undefined | null;
  if (chevron.localName === "i") {
    topParent = chevron.parentElement?.parentElement?.parentElement;
  } else if (chevron.localName === "div")
    topParent = chevron.parentElement?.parentElement;
  if (!topParent) return;

  const currentStatus = topParent.dataset.status ?? "";
  const newStatus = currentStatus === "active" ? "" : "active";
  topParent.dataset.status = newStatus;

  const players: HTMLElement | null = topParent.querySelector(".game__info-players");
  if (!players) return;
  const prop: string = "--max-height";
  const scrollHeigth: number = players.children[0].scrollHeight;
  if (players.style.getPropertyValue(prop)) {
    players.style.removeProperty(prop);
  } else {
    players.style.setProperty(prop, `${scrollHeigth}px`);
  }
}

toggleButtons.forEach((button: HTMLElement) => {
  button.addEventListener("click", collapsableEvent)
});
