using FluentValidation;
using MISA_Api.Middleware;
using MISA_Core.Dtos.Request;
using MISA_Core.Entities;
using MISA_Core.Interface.Repository;
using MISA_Core.Interface.Service;
using MISA_Core.Interfaces;
using MISA_Core.Service;
using MISA_Core.Validator;
using MISA_Infrastructure.DbContext;
using MISA_Infrastructure.Repository;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddScoped<IShiftsRepo, ShiftsRepo>();
builder.Services.AddScoped<IShiftsService, ShiftsService>();
builder.Services.AddScoped<IDatabaseConnection, MySqlConnectionContext>();

// Fluent Validator
builder.Services.AddScoped<IValidator<ShiftAddDtoRequest>, ShiftAddDtoRequestValidator>();
builder.Services.AddScoped<IValidator<ShiftUpdateDtoRequest>, ShiftUpdateDtoRequestValidator>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddExceptionHandler<GlobalExceptionMiddleware>();
builder.Services.AddProblemDetails();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowVite",
        policy =>
        {
            policy
                .WithOrigins(
                    "http://localhost:5173",
                    "https://localhost:5173"
                )
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowVite");

app.MapControllers();

app.Run();
