import * as ko from "knockout";
import { SurveyModel } from "../../../survey";
var template = require("html-loader?interpolate!val-loader!./buttons.html");

export class ProgressButtonsViewModel {
  private hasScroller = ko.observable(false);
  private updateScroller: any = undefined;
  constructor (private model: SurveyModel, private element: any) {
    this.updateScroller = setInterval(() => {
      let listContainerElement: HTMLElement = this.element.querySelector(
        "." + model.css.progressButtonsListContainer);
      if (!!listContainerElement) {
        this.hasScroller(listContainerElement.scrollWidth > listContainerElement.offsetWidth);
      }
    }, 100);
  }
  public getListElementCss(index: any): string {
    if (index() >= this.model.visiblePages.length) return;
    let elementCss: string = this.model.visiblePages[index()].passed ?
      this.model.css.progressButtonsListElementPassed : "";
    if (this.model.currentPageNo === index()) {
      elementCss += !!elementCss ? " " : "";
      elementCss += this.model.css.progressButtonsListElementCurrent;
    }
    return elementCss;
  }
  public clickListElement(index: any): void {
    this.model.goToPage(index());
  }
  public getScrollButtonCss(isLeftScroll: boolean): any {
    return ko.computed(() => {
      let scrollCss: string = isLeftScroll ?
        this.model.css.progressButtonsImageButtonLeft :
        this.model.css.progressButtonsImageButtonRight;
      if (!this.hasScroller()) scrollCss += " " + this.model.css.progressButtonsImageButtonHidden;
      return scrollCss;
    }, this);
  }
  public clickScrollButton(listContainerElement: Element, isLeftScroll: boolean): void {
    listContainerElement.scrollLeft += (isLeftScroll ? -1 : 1) * 70;
  }
  public dispose(): void {
    if (typeof this.updateScroller !== "undefined") {
      clearInterval(this.updateScroller);
      this.updateScroller = undefined;
    }
  }
};

ko.components.register("survey-progress-buttons", {
  viewModel: {
    createViewModel: (params: any, componentInfo: any) => {
      return new ProgressButtonsViewModel(params.model, componentInfo.element.nextElementSibling);
    },
  },
  template: template
});