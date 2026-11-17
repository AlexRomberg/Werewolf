import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupingToggleComponent } from '../components/grouping-toggle/grouping-toggle.component';

describe('GroupingToggleComponent', () => {
  let fixture: ComponentFixture<GroupingToggleComponent>;

  const buttons = () => [...(fixture.nativeElement as HTMLElement).querySelectorAll('button')];
  const pressed = () =>
    buttons()
      .filter((button) => button.getAttribute('aria-pressed') === 'true')
      .map((button) => button.textContent?.trim());

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(GroupingToggleComponent);
    fixture.componentRef.setInput('grouping', 'game');
    await fixture.whenStable();
  });

  it('should offer both groupings and mark the current one', () => {
    expect(buttons().map((button) => button.textContent?.trim())).toEqual(['Game', 'Group']);
    expect(pressed()).toEqual(['Game']);
  });

  it('should switch to the grouping that is pressed', async () => {
    buttons()[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.grouping()).toBe('group');
    expect(pressed()).toEqual(['Group']);
  });
});
