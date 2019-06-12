import { CarouselFields } from './carousel';
import { DeliveryWithFollowUp } from './followUp';
import { TextFields } from './text';
import * as cms from '../cms';
import * as contentful from 'contentful';
import { ContentWithKeywordsFields, DeliveryApi } from './deliveryApi';

export class UrlDelivery extends DeliveryWithFollowUp {
  constructor(protected readonly delivery: DeliveryApi) {
    super(delivery);
  }

  async url(id: string): Promise<cms.Url> {
    let entry: contentful.Entry<UrlFields> = await this.delivery.getEntry(id);
    let fields = entry.fields;
    let followUp = await this.followUp!.fromFields(
      fields.followup!,
      new cms.CallbackMap()
    );
    let name = fields.name || fields.url;
    return new cms.Url(
      name,
      fields.url,
      fields.shortText,
      fields.keywords,
      followUp
    );
  }
}

export interface UrlFields extends ContentWithKeywordsFields {
  url: string;
  followup?: contentful.Entry<TextFields | CarouselFields>;
}