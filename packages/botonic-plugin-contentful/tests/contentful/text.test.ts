import { expectImgUrlIs } from './image.test';
import { testContentful } from './contentful.helper';
import { mock } from 'ts-mockito';
import * as cms from '../../src';

export const TEST_POST_FAQ1_ID = 'djwHOFKknJ3AmyG6YKNip';
const TEST_POST_FAQ2_ID = '22h2Vba7v92MadcL5HeMrt';
const TEST_FBK_OK_MSG = '63lakRZRu1AJ1DqlbZZb9O';
const TEST_SORRY = '6ZjjdrKQbaLNc6JAhRnS8D';
const TEST_TEXT_URL_BUTTON = '2N9HQ960BdUVlDDQjpTA6I';
const TEST_TEXT_IMAGE_FOLLOWUP = '35aCTbYevK13TAXqqCdY8t';
export const KEYWORDS_OK = 'GbIpKJu8kW6PqMGAUYkoS';
export const KEYWORDS_NOT_FOUND = '4C2ghzuNPXIl0KqLaq1Qqm';

test('TEST: contentful text without followup', async () => {
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(TEST_SORRY, cms.CallbackMap.forAllIds(callback));

  // assert
  expect(text.text).toEqual(
    'Siento no haber podido ayudarle, le invitamos a contactar con uno de nuestros agentes.'
  );
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Contactar con agente');
  expect(text.buttons[0].callback).toEqual(
    new cms.ContentCallback(cms.ModelType.TEXT, '3lzJqY4sI3VDgMRFsgvtvT')
  );
  expect(text.followUp).toBeUndefined();
});

test('TEST: contentful text with URL button with followup', async () => {
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(
    TEST_POST_FAQ1_ID,
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(text.text).toEqual(
    'Después de que se autorice el pago recibirá un correo electrónico con el número del pedido. A partir de este momento podrá consultar el estado de este en el apartado “Mis pedidos” directamente en su cuenta.\n' +
      'Una vez enviado, recibirá un correo electrónico de confirmación de salida de almacén que incluirá un enlace de seguimiento. Con este enlace podrá en todo momento saber la situación/ubicación.\n' +
      'Si ha realizado su compra con un perfil invitado, siga su pedido con el enlace que aparece en el email de confirmación. Si tiene otras dudas sobre la entrega del pedido, el equipo de Atención al Cliente está a su disposición.'
  );
  expect(text.shortText).toEqual('Encontrar mi pedido');
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Acceda a su cuenta');
  expect(text.buttons[0].callback.url).toEqual(
    'https://www.massimodutti.com/es/'
  );
  expect(text.followUp).not.toBeUndefined();
});

test('TEST: contentful text with payload button', async () => {
  let sut = testContentful();

  // act
  let text = await sut.text(KEYWORDS_NOT_FOUND);

  // assert
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].callback.payload).toBe('humanHandOff');
});

test('TEST: contentful text without buttons with text followup', async () => {
  let sut = testContentful();

  // act
  let text = await sut.text(TEST_POST_FAQ2_ID);

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followUp as cms.Text).buttons).toHaveLength(2);
});

test('TEST: contentful text without buttons with carousel followup', async () => {
  let sut = testContentful();

  // act
  let text = await sut.text(TEST_FBK_OK_MSG);

  // assert
  expect(text.buttons).toHaveLength(0);
  expect((text.followUp as cms.Carousel).elements).toHaveLength(3);
});

test('TEST: contentful text without buttons with image followup', async () => {
  let sut = testContentful();

  // act
  let text = await sut.text(TEST_TEXT_IMAGE_FOLLOWUP);

  // assert
  expectImgUrlIs((text.followUp as cms.Image).imgUrl, 'red.jpg');
});

test('TEST: contentful text from model name', async () => {
  let sut = testContentful();
  let callback = mock(cms.Callback);

  // act
  let text = await sut.text(
    'PRE_MENU_CRSL',
    cms.CallbackMap.forAllIds(callback)
  );

  // assert
  expect(text.name).toEqual('PRE_MENU_CRSL');
  expect(text.buttons).toHaveLength(3);
});

test('TEST: contentful text with URL button', async () => {
  let sut = testContentful();

  // act
  let text = await sut.text(TEST_TEXT_URL_BUTTON);

  // assert
  expect(text.buttons).toHaveLength(1);
  expect(text.buttons[0].text).toEqual('Web de Hubtype');
  expect(text.buttons[0].callback).toEqual(
    cms.Callback.ofUrl('https://www.hubtype.com/')
  );
});