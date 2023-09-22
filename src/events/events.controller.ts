/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  ValidationPipe,
  Get,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { EventsService } from './events.service';
import {
  EventDto,
  EventDetailDto,
  EventRegistrationDto,
  EventUnregistrationDto,
  EventEditDto,
} from './dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async createEvent(@Body(ValidationPipe) EventDto: EventDto, @Req() req) {
    const userId = req.user.userId;
    const createdEvent = await this.eventService.CreateEvent(EventDto, userId);
    return createdEvent;
  }

  @UseGuards(JwtGuard)
  @Put(':id')
  async editEvent(
    @Param('id') eventId: number,
    @Body() eventEditDto: EventEditDto,
  ) {
    const updatedEvent = await this.eventService.editEvent(
      eventId,
      eventEditDto,
    );
    return updatedEvent;
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteEvent(@Param('id') eventId: number) {
    await this.eventService.deleteEvent(eventId);
    return { message: 'Evento eliminado exitosamente.' };
  }

  @UseGuards(JwtGuard)
  @Get()
  async getAllEvents() {
    const events = await this.eventService.getAllEvents();
    return events;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getEventById(@Param('id') id: number): Promise<EventDetailDto> {
    const event = await this.eventService.getEventById(id);

    const eventDetail: EventDetailDto = {
      eventId: event.eventId,
      title: event.title,
      description: event.description,
      date: event.date,
      location: event.location,
      creator: event.creator,
    };
    return eventDetail;
  }

  @UseGuards(JwtGuard)
  @Post(':id/register')
  async registerUserForEvent(
    @Param('id') eventId: number,
    @Body() EventRegistrationDto: EventRegistrationDto,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    await this.eventService.registerUserForEvent(eventId, userId);
    return 'Usuario registrado exitosamente';
  }

  @UseGuards(JwtGuard)
  @Delete(':id/unregister')
  async unregisterEvent(
    @Param('id') eventId: number,
    @Body() unregistrationDto: EventUnregistrationDto,
    @Req() req,
  ) {
    const userId = Number(req.user.userId);
    console.log(userId);
    await this.eventService.unregisterEvent(eventId, userId);
    return 'Usuario eliminado del evento exitosamente';
  }

  @UseGuards(JwtGuard)
  @Get(':id/registrations')
  async getEventRegistrations(@Param('id') eventId: number) {
    const registrations =
      await this.eventService.getRegistrationsForEvent(eventId);
    return registrations;
  }
}
