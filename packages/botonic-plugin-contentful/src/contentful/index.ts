import { DEFAULT_CONTEXT, Context } from '../cms/context'
import { SearchResult } from '../search'
import { AssetDelivery } from './asset'
import { DateRangeDelivery } from './date-range'
import { ImageDelivery } from './image'
import { ScheduleDelivery } from './schedule'
import { KeywordsDelivery } from './keywords'
import { FollowUpDelivery } from './follow-up'
import {
  CommonFields,
  DateRangeContent,
  ModelType,
  ScheduleContent,
  TopContent,
} from '../cms'
import { ButtonDelivery } from './button'
import { DeliveryApi } from './delivery-api'
import { CarouselDelivery } from './carousel'
import { StartUpDelivery } from './startup'
import { TextDelivery } from './text'
import { UrlDelivery } from './url'
import * as cms from '../cms'
import { QueueDelivery } from './queue'
import * as contentful from 'contentful'
import { ContentfulOptions } from '../plugin'
import { CachedDelivery } from './cache'
import { CreateClientParams } from 'contentful'

export default class Contentful implements cms.CMS {
  private readonly _delivery: DeliveryApi
  private readonly _carousel: CarouselDelivery
  private readonly _text: TextDelivery
  private readonly _startUp: StartUpDelivery
  private readonly _url: UrlDelivery
  private readonly _keywords: KeywordsDelivery
  private readonly _schedule: ScheduleDelivery
  private readonly _dateRange: DateRangeDelivery
  private readonly _image: ImageDelivery
  private readonly _asset: AssetDelivery
  private readonly _queue: QueueDelivery

  /**
   *
   * See https://www.contentful.com/developers/docs/references/content-delivery-api/#/introduction/api-rate-limits
   * for API rate limits
   *
   *  https://www.contentful.com/developers/docs/javascript/tutorials/using-js-cda-sdk/
   */
  constructor(options: ContentfulOptions) {
    const params: CreateClientParams = {
      space: options.spaceId,
      accessToken: options.accessToken,
      timeout: options.timeoutMs,
    }
    if (options.environment) {
      params.environment = options.environment
    }
    const client = contentful.createClient(params)
    const memoizedClient = new CachedDelivery(client, options.cacheTtlMs)
    const delivery = new DeliveryApi(memoizedClient)

    this._delivery = delivery
    const button = new ButtonDelivery(delivery)
    this._carousel = new CarouselDelivery(delivery, button)
    this._text = new TextDelivery(delivery, button)
    this._startUp = new StartUpDelivery(delivery, button)
    this._url = new UrlDelivery(delivery)
    this._image = new ImageDelivery(delivery)
    this._asset = new AssetDelivery(delivery)
    this._queue = new QueueDelivery(delivery)
    const followUp = new FollowUpDelivery(
      this._delivery,
      this._carousel,
      this._text,
      this._image,
      this._startUp
    )
    ;[
      this._text,
      this._url,
      this._carousel,
      this._image,
      this._startUp,
    ].forEach(d => d.setFollowUp(followUp))
    this._keywords = new KeywordsDelivery(delivery)
    this._schedule = new ScheduleDelivery(delivery)
    this._dateRange = new DateRangeDelivery(delivery)
  }

  async carousel(id: string, context = DEFAULT_CONTEXT): Promise<cms.Carousel> {
    return this._carousel.carousel(id, context)
  }

  async text(id: string, context = DEFAULT_CONTEXT): Promise<cms.Text> {
    return this._text.text(id, context)
  }

  async startUp(id: string, context = DEFAULT_CONTEXT): Promise<cms.StartUp> {
    return this._startUp.startUp(id, context)
  }

  async url(id: string, context = DEFAULT_CONTEXT): Promise<cms.Url> {
    return this._url.url(id, context)
  }

  async queue(id: string, context = DEFAULT_CONTEXT): Promise<cms.Queue> {
    return this._queue.queue(id, context)
  }

  image(id: string, context = DEFAULT_CONTEXT): Promise<cms.Image> {
    return this._image.image(id, context)
  }

  chitchat(id: string, context = DEFAULT_CONTEXT): Promise<cms.Chitchat> {
    return this._text.text(id, context)
  }

  contents(
    model: ModelType,
    context = DEFAULT_CONTEXT,
    filter?: (cf: CommonFields) => boolean
  ): Promise<TopContent[]> {
    return this._delivery.contents(
      model,
      context,
      (entry: contentful.Entry<any>, ctxt: Context) =>
        this.fromEntry(entry, ctxt),
      filter
    )
  }

  async fromEntry(
    entry: contentful.Entry<any>,
    context: Context
  ): Promise<TopContent> {
    const model: ModelType = DeliveryApi.getContentModel(entry)
    switch (model) {
      case ModelType.CAROUSEL:
        return this._carousel.fromEntry(entry, context)
      case ModelType.QUEUE:
        return QueueDelivery.fromEntry(entry)
      case ModelType.CHITCHAT:
      case ModelType.TEXT:
        return this._text.fromEntry(entry, context)
      case ModelType.IMAGE:
        return this._image.fromEntry(entry, context)
      case ModelType.URL:
        return this._url.fromEntry(entry, context)
      case ModelType.STARTUP:
        return this._startUp.fromEntry(entry, context)
      default:
        throw new Error(`${model} is not a Content type`)
    }
  }

  async contentsWithKeywords(
    context = DEFAULT_CONTEXT
  ): Promise<SearchResult[]> {
    return this._keywords.contentsWithKeywords(context)
  }

  async schedule(id: string): Promise<ScheduleContent> {
    return this._schedule.schedule(id)
  }

  asset(id: string): Promise<cms.Asset> {
    return this._asset.asset(id)
  }

  dateRange(id: string): Promise<DateRangeContent> {
    return this._dateRange.dateRange(id)
  }
}

export { DeliveryApi } from './delivery-api'
export { CarouselDelivery } from './carousel'
