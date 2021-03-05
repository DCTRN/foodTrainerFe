import { Content } from './content';

const text1 = 'text1';
const text2 = 'text2';

describe('Content', () => {
  it('should create empty instance', () => {
    expect(new Content()).toBeTruthy();
  });

  it('should test content methods', () => {
    const content = new Content();

    content.addText(text1);

    expect(content.getText().length).toEqual(1);

    content.deleteText(text1);
    content.deleteText(text1);

    expect(content.getText().length).toEqual(0);

    content.setText([text1, text2]);

    expect(content.getText().length).toEqual(2);

    content.clearContent();

    expect(content.getText().length).toEqual(0);
  });
});
