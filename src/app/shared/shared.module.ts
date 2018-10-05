import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TouchspinDirective } from './directives/touchspin.directive';
import { FlexLabelsDirective } from './directives/flex-labels.directive';
import { MaskInputDirective } from './directives/mask-input.directive';
import { AutoCompleteDirective } from './directives/auto-complete.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { SelectTagsDirective } from './directives/select-tags.directive';
import { SelectableDirective } from './directives/selectable.directive';
import { TooltipDirective } from './directives/tooltip.directive';
import { AutoHeightDirective } from './directives/auto-height.directive';
import { ScrollableDirective } from './directives/scrollable.directive';
import { ElementHeightDirective } from './directives/element-height.directive';
import { DatepickerDirective } from './directives/datepicker.directive';
import { PopoverDirective } from './directives/popover.directive';
import { ImagePreviewDirective } from './directives/image-preview.directive';
import { CapitalizeDirective } from './directives/capitalize.directive';
import { AutoResizeDirective } from './directives/auto-resize.directive';
import { BindContentPipe } from './pipes/bind-content.pipe';
import { GroupByPipe } from './pipes/group-by.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { SpacePipe } from './pipes/space.pipe';
import { CapitalizePipe } from './pipes/capitalize.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { EventCategoryPipe } from './pipes/event-category.pipe';
import { TimezonePipe } from './pipes/timezone.pipe';
import { CompareDatePipe } from './pipes/compare-date.pipe';
import { DecodePipe } from './pipes/decode.pipe';
import { DateNamePipe } from './pipes/date-name.pipe';
import { CommentsPipe } from './pipes/comments.pipe';
import { ReactionsPipe } from './pipes/reactions.pipe';
import { HasBeenTranslatedPipe } from './pipes/has-been-translated.pipe';
import { DisableCategoriesPipe} from './pipes/disable-categories.pipe';
import { FormArrayPipe} from './pipes/form-array.pipe';
import { TranslateLanguagePipe} from './pipes/translate-language.pipe';
import { HtmlTextPipe} from './pipes/html-text.pipe';
import { TranslateCountPipe} from './pipes/translate-count.pipe';
import { ImageMarginPipe} from './pipes/image-margin.pipe';
import { HowLongPipe} from './pipes/how-long.pipe';
@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TouchspinDirective,
    FlexLabelsDirective,
    MaskInputDirective,
    AutoCompleteDirective,
    AutoFocusDirective,
    SelectTagsDirective,
    SelectableDirective,
    TooltipDirective,
    AutoHeightDirective,
    ScrollableDirective,
    ElementHeightDirective,
    DatepickerDirective,
    PopoverDirective,
    ImagePreviewDirective,
    ClickOutsideDirective,
    CapitalizeDirective,
    AutoResizeDirective,
    BindContentPipe,
    GroupByPipe,
    OrderByPipe,
    SpacePipe,
    CapitalizePipe,
    EventCategoryPipe,
    TimezonePipe,
    CompareDatePipe,
    DecodePipe,
    DateNamePipe,
    CommentsPipe,
    ReactionsPipe,
    HasBeenTranslatedPipe,
    DisableCategoriesPipe,
    FormArrayPipe,
    TranslateLanguagePipe,
    HtmlTextPipe,
    TranslateCountPipe,
    ImageMarginPipe,
    HowLongPipe

  ],
  exports: [
    TouchspinDirective,
    FlexLabelsDirective,
    MaskInputDirective,
    AutoCompleteDirective,
    AutoFocusDirective,
    SelectTagsDirective,
    SelectableDirective,
    TooltipDirective,
    AutoHeightDirective,
    ScrollableDirective,
    ElementHeightDirective,
    DatepickerDirective,
    PopoverDirective,
    ImagePreviewDirective,
    ClickOutsideDirective,
    CapitalizeDirective,
    AutoResizeDirective,
    BindContentPipe,
    GroupByPipe,
    OrderByPipe,
    SpacePipe,
    CapitalizePipe,
    EventCategoryPipe,
    TimezonePipe,
    CompareDatePipe,
    DecodePipe,
    DateNamePipe,
    CommentsPipe,
    ReactionsPipe,
    HasBeenTranslatedPipe,
    DisableCategoriesPipe,
    FormArrayPipe,
    TranslateLanguagePipe,
    HtmlTextPipe,
    TranslateCountPipe,
    ImageMarginPipe,
    HowLongPipe
  ]
})
export class SharedModule { }

