import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: AnswerQuestionUseCase;

describe('Criar resposta', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new AnswerQuestionUseCase(inMemoryAnswersRepository);
  });

  test('deve ser possível criar uma resposta', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswersRepository.items[0]).toEqual(result.value?.answer);
    expect(
      inMemoryAnswersRepository.items[0].attachments.currentItems,
    ).toHaveLength(2);
    expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual(
      [
        expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityID('2') }),
      ],
    );
  });

  test('deve persistir os anexos ao criar uma nova resposta', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('1'),
        }),
      ]),
    );
  });
});
