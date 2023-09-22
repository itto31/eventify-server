import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EventDto, EventDetailDto, EventEditDto } from './dto';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  //Crea un evento
  async CreateEvent(eventdto: EventDto, userId: number) {
    const existingEvent = await this.prisma.event.findFirst({
      where: {
        title: eventdto.title,
        date: new Date(eventdto.date),
        creatorId: userId,
      },
    });

    if (existingEvent) {
      throw new NotFoundException(
        'Ya existe un evento con el mismo título y fecha.',
      );
    }
    try {
      const createdEvent = await this.prisma.event.create({
        data: {
          title: eventdto.title,
          description: eventdto.description,
          date: new Date(eventdto.date).toISOString(),
          location: eventdto.location,
          creatorId: userId,
        },
      });
      return createdEvent;
    } catch (error) {}
  }

  //Edita un evento
  async editEvent(eventId: number, eventEditDto: EventEditDto) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { eventId: Number(eventId) },
    });
    if (!existingEvent) {
      throw new NotFoundException('El evento no fue encontrado.');
    }
    const updatedEvent = await this.prisma.event.update({
      where: { eventId: Number(eventId) },
      data: {
        title: eventEditDto.title || existingEvent.title,
        description: eventEditDto.description || existingEvent.description,
        date:
          new Date(eventEditDto.date).toISOString() ||
          new Date(existingEvent.date).toISOString(),
        location: eventEditDto.location || existingEvent.location,
      },
    });

    return updatedEvent;
  }

  //Elimina un evento
  async deleteEvent(eventId: number) {
    const existingEvent = await this.prisma.event.findUnique({
      where: { eventId: Number(eventId) },
    });

    if (!existingEvent) {
      throw new NotFoundException('El evento no fue encontrado.');
    }

    await this.prisma.event.delete({
      where: { eventId: Number(eventId) },
    });

    return { message: 'Evento eliminado exitosamente.' };
  }

  //Obtiene todos los eventos
  async getAllEvents() {
    const events = await this.prisma.event.findMany();
    return events;
  }

  //Obtiene un evento por su id
  async getEventById(id: number): Promise<EventDetailDto> {
    const event = await this.prisma.event.findUnique({
      where: { eventId: Number(id) },
      include: {
        creator: {
          select: {
            userId: true,
            name: true,
          },
        },
      },
    });
    if (!event) {
      throw new NotFoundException('No se encontró el evento');
    }
    return event;
  }

  //Registra un usuario en un evento
  async registerUserForEvent(eventId: number, userId: number) {
    const existingRegistration = await this.prisma.eventUser.findFirst({
      where: {
        eventId: Number(eventId),
        creatorId: Number(userId),
      },
    });

    if (existingRegistration) {
      throw new ConflictException(
        'El usuario ya está registrado en este evento.',
      );
    }

    const event = await this.prisma.event.findUnique({
      where: { eventId: Number(eventId) },
    });
    if (!event) {
      throw new NotFoundException('El evento no fue encontrado.');
    }
    await this.prisma.eventUser.create({
      data: {
        eventId: Number(eventId),
        creatorId: Number(userId),
      },
    });

    return 'Usuario registrado exitosamente en el evento.';
  }

  //Elimina un usuario de un evento
  async unregisterEvent(eventId: number, userId: number) {
    console.log(userId);
    const event = await this.prisma.event.findUnique({
      where: { eventId: Number(eventId) },
    });
    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }
    const user = await this.prisma.user.findUnique({
      where: { userId: Number(userId) },
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const registration = await this.prisma.eventUser.findFirst({
      where: {
        eventId: Number(eventId),
        creatorId: Number(userId),
      },
    });
    if (!registration) {
      throw new NotFoundException(
        'El usuario no está registrado en este evento',
      );
    }
    await this.prisma.eventUser.delete({ where: { id: registration.id } });
  }

  //Obtiene los usuarios registrados en un evento
  async getRegistrationsForEvent(eventId: number) {
    const event = await this.prisma.event.findUnique({
      where: { eventId: Number(eventId) },
    });

    if (!event) {
      throw new NotFoundException('Evento no encontrado');
    }
    const registrations = await this.prisma.eventUser.findMany({
      where: { eventId: Number(eventId) },
      include: { creator: true },
    });

    const formattedRegistrations = registrations.map((registration) => ({
      eventId: registration.eventId,
      userId: registration.creatorId,

      user: {
        userId: registration.creator.userId,
        email: registration.creator.email,
        name: registration.creator.name,
      },
    }));

    return formattedRegistrations;
  }

  //buscador de eventos
  async searchEventsByTitle(title: string) {
    const events = await this.prisma.event.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });

    return events;
  }
}
