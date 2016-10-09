import { ProjectSearchPipe } from './project-search.pipe';
import { PROJECTS } from '../../testing/fake-project.service.spec';

describe('ProjectSearchPipe', () => {
  // This pipe is a pure, stateless function so no need for BeforeEach
  let pipe = new ProjectSearchPipe();

  it('filters a null/undefined project list', () => {
    expect(pipe.transform(null, null)).toEqual(null);
    expect(pipe.transform(undefined, null)).toEqual(undefined);
  });

  it('filters a valid project list with null/undefined args', () => {
    expect(pipe.transform(PROJECTS, null)).toEqual(PROJECTS);
    expect(pipe.transform(PROJECTS, undefined)).toEqual(PROJECTS);
  });

  it('filters a valid, but empty project list with a valid args', () => {
    expect(pipe.transform([], 'Bya')).toEqual([]);
  });

  it('filters a valid, but empty project list with null args', () => {
    expect(pipe.transform([], null)).toEqual([]);
  });

  it('filters a valid project list by name, returning only one result', () => {
    //toEqual compares objects
    expect(pipe.transform(PROJECTS, 'BYA')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'bya')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'bYA')).toEqual([PROJECTS[0]]);
  });

  it('filters a valid project list by name, returning only one result', () => {
    //toEqual compares objects
    expect(pipe.transform(PROJECTS, 'prj')).toEqual([PROJECTS[0], PROJECTS[1]]);
    expect(pipe.transform(PROJECTS, 'PRJ')).toEqual([PROJECTS[0], PROJECTS[1]]);
    expect(pipe.transform(PROJECTS, 'pRj')).toEqual([PROJECTS[0], PROJECTS[1]]);
  });

  it('filters a valid project list by shortDescription', () => {
    //toEqual compares objects
    expect(pipe.transform(PROJECTS, '1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, ' 1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'short description 1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'SHORT DESCRIPTION 1')).toEqual([PROJECTS[0]]);
    expect(pipe.transform(PROJECTS, 'Description 1')).toEqual([PROJECTS[0]]);
  });
});
